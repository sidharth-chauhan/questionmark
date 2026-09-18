import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validateBody(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || (error as any).errors || [];
        res.status(400).json({
          error: {
            message: issues.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", "),
            code: "VALIDATION_ERROR",
          },
        });
        return;
      }
      next(error);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || (error as any).errors || [];
        res.status(400).json({
          error: {
            message: issues.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", "),
            code: "VALIDATION_ERROR",
          },
        });
        return;
      }
      next(error);
    }
  };
}
