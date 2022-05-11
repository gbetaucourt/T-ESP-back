/**
 * @swagger
 * definitions:
 *   user:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         example: automatically generated
 *       userLevel:
 *         type: integer
 *         example: automatically generated
 *       username:
 *         type: string
 *       createDate:
 *         type: string
 *         example: "2022-03-31T23:02:24.745Z"
 *       password:
 *         type: string
 *         example: "required"
 *       email:
 *          type: string
 *          example: "required and unique"
 *       iotId:
 *         type: string
 *         example: "unique"
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       zipcode:
 *         type: string
 *       token:
 *         type: string
 *         example: "not filled outside /authenticate"
 */


/**
 * @swagger
 * definitions:
 *  moduleValue:
 *      properties:
 *          value:
 *              type: string
 *          lastUpdate:
 *              type: string
 *          
 *          
 */


/**
 * @swagger
 * definitions:
 *  modulePing:
 *      properties:
 *          isActive:
 *              type: boolean
 *          lastUpdate:
 *              type: string
 *          
 *          
 */

/**
 * @swagger
 * definitions:
 *  moduleType:
 *      properties:
 *          led:
 *              type: string
 *          lamp:
 *              type: string
 *          luminosity:
 *              type: string
 *          temperature:
 *              type: string
 */