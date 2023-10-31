const JobSchema = require("../../models/job")


const searchAndFilterJobPosts = async (filters) => {
    try {
        // Define the base query to fetch job posts
        let query = JobSchema.find({});

        // Example: Search by title and tags
        if (filters.title) {
            const titleRegex = new RegExp(filters.title, 'i');
            query = query.or([{ title: { $regex: titleRegex } }, { tags: { $in: [titleRegex] } }]);
        }

        // Example: Filter by category
        if (filters.category) {
            query = query.where('category', filters.category);
        }

        // Example: Filter by budget range
        if (filters.minBudget && filters.maxBudget) {
            query = query.where('budget').gte(filters.minBudget).lte(filters.maxBudget);
        }

        // Example: Filter by job type
        if (filters.jobType) {
            query = query.where('jobType', filters.jobType);
        }

        // Execute the query and retrieve the filtered job posts
        const filteredJobPosts = await query.exec();

        return filteredJobPosts;
    } catch (error) {
        logger.error(`Error in searchAndFilterJobPosts: ${error}`);
        throw error;
    }
};


const searchMiddleware = async (req, res, next) => {
    try {
        const query = req.query.query; // The search query from the request
        if (!query) {
            return next(); // No search query, proceed to the next middleware
        }

        const searchKeywords = query.trim().toLowerCase().split(' ');

        // Define a pipeline for the aggregation
        const pipeline = [];

        // Stage 1: Match documents with matching title or tags
        pipeline.push({
            $match: {
                $or: [
                    { title: { $in: searchKeywords } },
                    { tags: { $in: searchKeywords } },
                ],
            },
        });

        // Stage 2: Add a relevance score based on the number of keyword matches
        pipeline.push({
            $addFields: {
                relevance: {
                    $size: {
                        $setIntersection: [searchKeywords, '$title', '$tags'],
                    },
                },
            },
        });

        // Stage 3: Sort by relevance score in descending order
        pipeline.push({ $sort: { relevance: -1 } });

        // Execute the aggregation pipeline
        const results = await JobSchema.aggregate(pipeline);

        // Add the search results to the request object
        req.searchResults = results;

        next();
    } catch (error) {
        // Handle any errors
        console.error('Search middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};