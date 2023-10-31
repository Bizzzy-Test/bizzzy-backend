const generateSearchAndFilterMiddleware = (schema, filterOptions) => {
    return async (req, res, next) => {
        try {
            const filters = req.query;

            // Define the base query to fetch job posts using the provided schema
            let query = schema.find({});

            // Apply filters based on the provided query parameters and filter options
            for (const option of filterOptions) {
                if (filters[option.field]) {
                    const field = option.field;
                    const value = filters[field];

                    // Customize filter logic based on the filter option
                    if (option.type === 'regex') {
                        query = query.where(field, new RegExp(value, 'i'));
                    } else if (option.type === 'equals') {
                        query = query.where(field, value);
                    }
                }
            }

            // Execute the query and retrieve the filtered items
            const filteredItems = await query.exec();

            // Add the filtered items to the request object for use in subsequent middleware or route handlers
            req.filteredItems = filteredItems;

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            logger.error(`Error in searchAndFilterMiddleware: ${error}`);
            res.status(500).json({
                data: error,
                success: false,
                message: messageConstants.INTERNAL_SERVER_ERROR
            });
        }
    };
};

module.exports = {
    generateSearchAndFilterMiddleware,
};
