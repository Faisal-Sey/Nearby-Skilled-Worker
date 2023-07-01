import { Service } from 'typedi';
import { Response } from 'express';

@Service()
export class ApiResponse {
  public successResponse(message: string, res: Response): Response {
    const resp = {
      status: 1,
      message: message,
    };

    return res.status(200).json(resp);
  }

  public creationSuccessResponse(message: string, res: Response): Response {
    const resp = {
      status: 1,
      message: message,
    };

    return res.status(201).json(resp);
  }

  public creationSuccessWithDataResponse(data: any, message: string, res: Response): Response {
    const resp = {
      status: 1,
      message: message,
      data: data,
    };

    return res.status(201).json(resp);
  }

  public successWithDataResponse(data: any, message: string, res: Response): Response {
    const resp = {
      status: 1,
      message: message,
      data: data,
    };

    return res.status(200).json(resp);
  }

  public errorResponse(message: string, res: Response): Response {
    const resp = {
      status: 0,
      message: message,
    };

    return res.status(400).json(resp);
  }

  public errorWithDataResponse(data: any, message: string, res: Response): Response {
    const resp = {
      status: 0,
      message: message,
      data: data,
    };

    return res.status(400).json(resp);
  }

  public unAuthorizedResponse(data: any, message: string, res: Response): Response {
    const resp = {
      status: 0,
      message: message,
      data: data,
    };

    return res.status(401).json(resp);
  }

  public notFoundResponse(data: any, message: string, res: Response): Response {
    const resp = {
      status: 0,
      message: message,
      data: data,
    };

    return res.status(404).json(resp);
  }
}
