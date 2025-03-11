import { NextFunction, Request, RequestHandler, Response } from "express";
import { IApiResponse } from "../types/common";
import { isValidObjectId } from "mongoose";

const validateObjectId = (paramName: string): RequestHandler => {
  return (
    req: Request,
    res: Response<IApiResponse>,
    next: NextFunction
  ): void => {
    const id = req.params[paramName]
    if (!isValidObjectId(id)) {
      res.status(400).json({ message: `Invalid ${paramName}` })
      return;
    };
    next();
  };
};

export default validateObjectId;

