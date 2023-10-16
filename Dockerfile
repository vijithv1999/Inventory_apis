FROM node:18-alpine
WORKDIR /STUDY
COPY . .
RUN yarn install --production
CMD ["node", "/app.js"]
EXPOSE 3000