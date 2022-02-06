module.exports = {
  "swaggerDefinition":{
    "openapi": "3.0.0",
    //"swagger":"2.0",
    "info": {
      "title": "Alcancia API",
      "description": "",
      "version": "1.0"
    },
    "servers": [
      {
        "url": "https://virtserver.swaggerhub.com/royers/Alcancia/1.0",
        "description": "AlcanciaBackend"
      },
      {
        "url": "https://royerdonnetarenas.tech/",
        "description": "AlcanciaBackend"
      },
      {
        "url": "http://127.0.0.1:8000/",
        "description": "AlcanciaBackendLocal"
      },
      {
        "url": "https://2a95-2806-2f0-6060-509-22ed-7127-368a-2a16.ngrok.io",
        "description": "ngrok"
      }
    ],
    "tags": [
      {
        "name": "users",
        "description": "Everything about users",
        "externalDocs": {
          "description": "Find out more",
          "url": "http://swagger.io"
        }
      }
    ],
    "paths": {
      "/api/users/{uid}": {
        "get": {
          "tags": [
            "users"
          ],
          "summary": "Returns user basic information.",
          "description": "User endpoin to retrive basic user information",
          "parameters": [
            {
              "name": "uid",
              "in": "path",
              "description": "The ID of the user to return.",
              "required": true,
              "style": "simple",
              "explode": false,
              "schema": {
                "type": "string",
                "example": "wzjhbbxemra4goFJQfih2uoNKnw2"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/inline_response_200"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized."
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "No user info"
            }
          },
          "security": [
            {
              "BearerAuth": []
            }
          ]
        }
      },
      "/api/users/{uid}/deposits": {
        "get": {
          "tags": [
            "user"
          ],
          "summary": "Returns an array of user deposits.",
          "description": "User endpoin to retrive all user deposits, sorted by date",
          "parameters": [
            {
              "name": "uid",
              "in": "path",
              "description": "The ID of the user to return.",
              "required": true,
              "style": "simple",
              "explode": false,
              "schema": {
                "type": "string",
                "example": "wzjhbbxemra4goFJQfih2uoNKnw2"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "OK",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/deposits"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized."
            },
            "403": {
              "description": "Forbidden"
            },
            "404": {
              "description": "No user info"
            }
          },
          "security": [
            {
              "BearerAuth": []
            }
          ]
        }
      }
    },
    "components": {
      "schemas": {
        "deposits": {
          "type": "object",
          "properties": {
            "created_time": {
              "type": "string",
              "example": "022-01-24T20:38:37Z"
            },
            "id": {
              "type": "string",
              "example": "40034652B87541704"
            },
            "paypal_id": {
              "type": "string",
              "example": "40034652B87541704"
            },
            "gross_amount": {
              "type": "number",
              "example": 400.3
            },
            "net_amount": {
              "type": "number",
              "example": 305.5
            },
            "paypal_fee": {
              "type": "number",
              "example": 5.5
            },
            "status": {
              "type": "string",
              "example": "COMPLETED"
            },
            "payer": {
              "$ref": "#/components/schemas/deposits_payer"
            }
          }
        },
        "inline_response_200": {
          "type": "object",
          "properties": {
            "uid": {
              "type": "string",
              "example": "wzjhbbxemra4goFJQfih2uoNKnw2"
            },
            "name": {
              "type": "string",
              "example": "Juan Diego"
            },
            "last_name": {
              "type": "string",
              "example": "Oliva"
            },
            "email": {
              "type": "string",
              "example": "juandi@buidlcapital.xyz"
            },
            "balance": {
              "type": "number",
              "example": 50.69
            }
          }
        },
        "deposits_payer_name": {
          "type": "object",
          "properties": {
            "given_name": {
              "type": "string",
              "example": "Juan Diego"
            },
            "surname": {
              "type": "string",
              "example": "Oliva"
            }
          }
        },
        "deposits_payer": {
          "type": "object",
          "properties": {
            "addres": {
              "type": "string"
            },
            "email_address": {
              "type": "string",
              "example": "test@alcancia.com"
            },
            "name": {
              "$ref": "#/components/schemas/deposits_payer_name"
            }
          }
        }
      },
      "securitySchemes": {
        "BearerAuth": {
          "type": "http",
          "scheme": "bearer"
        }
      },
    },
    
  },
  
  "apis":['./routes/*.js'],
}