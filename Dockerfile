FROM node:22.11.0-alpine3.20

WORKDIR /home/node
USER node

# Copy package.json ONLY and install (no dev dependencies)
COPY --chown=node:node package.json .
RUN npm install --omit=dev

# Copy the project files by allow list
# Having issues? Check and edit .dockerignore
COPY --chown=node:node . .

EXPOSE 8080
CMD ["npm", "start"]
