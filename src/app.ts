import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { todosRouter } from './routes/todos';

const app = express();

// Swagger setup
type SwaggerRequest = {
  headers: Record<string, string>;
  method?: string;
  url?: string;
};

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'API documentation for managing todos',
    },
    tags: [
      {
        name: 'Todos',
        description: 'Operations related to todo items',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The unique ID of the todo' },
            title: { type: 'string', description: 'The title of the todo' },
            completed: {
              type: 'boolean',
              description: 'Whether the todo is completed',
            },
          },
          required: ['id', 'title', 'completed'],
        },
        NewTodo: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'The title of the todo' },
            completed: {
              type: 'boolean',
              description: 'Whether the todo is completed',
            },
          },
          required: ['title', 'completed'],
        },
      },
    },
  },
  apis: ['./src/routes/todos/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());

app.use(
  '/swagger-ui.css',
  express.static(path.join(__dirname, 'css/swagger-ui.css'))
);

app.use(
  '/api-docs-local',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCssUrl: '/swagger-ui.css',
    customSiteTitle: 'Todo API Documentation',
    swaggerOptions: {
      requestInterceptor: (req: SwaggerRequest) => {
        console.log('Intercepting request:', req);
        req.headers['api-key'] = '0ICVyrNhPL56Oss58qv-_y42PhSQvYcPm6Vz26j4bNw';
        return req;
      },
    },
  })
);

app.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocs);
});

app.get('/api-docs', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Todo API Docs</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = () => {
            SwaggerUIBundle({
              url: '/swagger.json',
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
              layout: "StandaloneLayout"
            });
          };
        </script>
      </body>
    </html>
  `);
});

app.use('/todos', todosRouter);

// app.listen(8080, () => {
//   console.log('Server running on port 8080');
//   console.log('Swagger docs available at http://localhost:8080/api-docs');
// });

export default app;
