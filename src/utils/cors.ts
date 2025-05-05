export const allowCors = (handler: (req: Request, res: Response) => Promise<void>) => {
    return async (req: Request, res: Response) => {
      // Set CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Allowed HTTP methods
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers
  
      // Handle preflight requests
      if (req.method === "OPTIONS") {
        res.status(204).end(); // Respond with no content for preflight requests
        return;
      }
  
      // Call the actual handler
      await handler(req, res);
    };
  };