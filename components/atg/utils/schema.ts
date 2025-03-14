export const GolangSchema = `{
    "openapi": "3.0.3",
    "info": {
      "title": "Animal API",
      "description": "API for managing animals",
      "version": "1.0.0"
    },
    "servers": [
      {
        "url": "http://localhost:5000/"
      }
    ],
    "paths": {
      "/": {
        "get": {
          "summary": "Welcome message",
          "operationId": "getWelcomeMessage",
          "responses": {
            "200": {
              "description": "Welcome to the world of animals",
              "content": {
                "text/plain": {
                  "schema": {
                    "type": "string",
                    "example": "Welcome to the world of animals."
                  }
                }
              }
            }
          }
        }
      },
      "/animals": {
        "get": {
          "summary": "Get list of animals",
          "operationId": "getAnimals",
          "responses": {
            "200": {
              "description": "List of animals",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "animals": {
                        "type": "object",
                        "additionalProperties": {
                          "type": "string"
                        }
                      }
                    },
                    "example": {
                      "animals": {
                        "animals": "apple"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "Error": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "format": "int32"
            },
            "message": {
              "type": "string"
            }
          }
        }
      }
    }
  }
  `;
export const PythonSchema = `{
    "openapi": "3.0.3",
    "info": {
      "title": "Animal API",
      "description": "API for managing animals",
      "version": "1.0.0"
    },
    "servers": [
      {
        "url": "http://localhost:5000/"
      }
    ],
    "paths": {
      "/": {
        "get": {
          "summary": "Welcome message",
          "operationId": "pingServer",
          "responses": {
            "200": {
              "description": "Welcome to the world of animals",
              "content": {
                "text/plain": {
                  "schema": {
                    "type": "string",
                    "example": "Welcome to the world of animals."
                  }
                }
              }
            }
          }
        }
      },
      "/animals": {
        "get": {
          "summary": "Get list of animals",
          "operationId": "getStoredAnimals",
          "responses": {
            "200": {
              "description": "List of animals",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "animals": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": {
                              "type": "string",
                              "example": "animals"
                            }
                          }
                        }
                      }
                    },
                    "example": {
                      "animals": [
                        {
                          "id": "animals"
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "Error": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "format": "int32"
            },
            "message": {
              "type": "string"
            }
          }
        }
      }
    }
  }
  `;
export const JavaScriptSchema = `{
    "openapi": "3.0.3",
    "info": {
      "title": "Animal API",
      "description": "API for managing animals",
      "version": "1.0.0"
    },
    "servers": [
      {
        "url": "http://localhost:5000/"
      }
    ],
    "paths": {
      "/": {
        "get": {
          "summary": "Welcome message",
          "operationId": "pingServer",
          "responses": {
            "200": {
              "description": "Welcome to the world of animals",
              "content": {
                "text/plain": {
                  "schema": {
                    "type": "string",
                    "example": "Welcome to the world of animals."
                  }
                }
              }
            }
          }
        }
      },
      "/animals": {
        "get": {
          "summary": "Get list of animals",
          "operationId": "getAnimals",
          "responses": {
            "200": {
              "description": "List of animals",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "animals": {
                        "type": "string",
                        "example": "apple"
                      }
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Error"
                  }
                }
              }
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "Error": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "format": "int32"
            },
            "message": {
              "type": "string"
            }
          }
        }
      }
    }
  }
  `;
