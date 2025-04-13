import {
    Injectable,
    NestMiddleware,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';
  
  @Injectable()
  export class ErrorMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      try {
        next();
      } catch (error) {
        // Gérer les erreurs
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Erreur interne du serveur';
        const errors: string[] = [];
  
        // Cas des erreurs HttpException (par exemple, NotFoundException)
        if (error instanceof HttpException) {
          status = error.getStatus();
          const errorResponse = error.getResponse();
          message =
            typeof errorResponse === 'string'
              ? errorResponse
              : (errorResponse as any).message || message;
          if ((errorResponse as any).error) {
            errors.push((errorResponse as any).error);
          }
        }
        // Cas des erreurs de validation (par exemple, avec class-validator)
        else if (error.name === 'ValidationError') {
          status = HttpStatus.BAD_REQUEST;
          message = 'Erreur de validation des données';
          if (Array.isArray(error.errors)) {
            error.errors.forEach((err: any) => {
              errors.push(
                `${err.property}: ${Object.values(err.constraints).join(', ')}`,
              );
            });
          }
        }
        // Autres erreurs non gérées
        else {
          console.error('Erreur non gérée:', error);
        }
  
        // Envoyer une réponse formatée
        res.status(status).json({
          statusCode: status,
          message,
          errors,
          timestamp: new Date().toISOString(),
          path: req.url,
        });
      }
    }
  }