import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Erreur interne du serveur';
      const errors: string[] = [];
  
      // Gérer les HttpException
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const errorResponse = exception.getResponse();
        message =
          typeof errorResponse === 'string'
            ? errorResponse
            : (errorResponse as any).message || message;
        if ((errorResponse as any).error) {
          errors.push((errorResponse as any).error);
        }
      }
      // Gérer les erreurs de validation (si non capturées par le middleware)
      else if ((exception as any).name === 'ValidationError') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Erreur de validation des données';
        if (Array.isArray((exception as any).errors)) {
          (exception as any).errors.forEach((err: any) => {
            errors.push(
              `${err.property}: ${Object.values(err.constraints).join(', ')}`,
            );
          });
        }
      }
      // Autres erreurs
      else {
        console.error('Erreur non gérée:', exception);
      }
  
      // Envoyer la réponse
      response.status(status).json({
        statusCode: status,
        message,
        errors,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }