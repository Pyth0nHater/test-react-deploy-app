FROM node:20-alpine AS build
WORKDIR /app
ENV DEPLOY_BASE_PATH="/pyth0nhater/test-react-deploy-app"
ENV PUBLIC_URL="/pyth0nhater/test-react-deploy-app"
ENV BASE_URL="/pyth0nhater/test-react-deploy-app"
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi
COPY . .
RUN npm run build
RUN if [ -n "$DEPLOY_BASE_PATH" ] && [ "$DEPLOY_BASE_PATH" != "/" ]; then \
      for dir in /app/dist /app/build /app/out; do \
        if [ -d "$dir" ]; then \
          find "$dir" -name '*.html' -exec sed -i \
            -e "s|href=\"/|href=\"$DEPLOY_BASE_PATH/|g" \
            -e "s|src=\"/|src=\"$DEPLOY_BASE_PATH/|g" \
            -e "s|content=\"/|content=\"$DEPLOY_BASE_PATH/|g" \
            -e "s|url(/|url($DEPLOY_BASE_PATH/|g" {} +; \
        fi; \
      done; \
    fi
RUN mkdir -p /opt/app-static \
 && if [ -d /app/dist ]; then cp -R /app/dist/. /opt/app-static/; \
 elif [ -d /app/build ]; then cp -R /app/build/. /opt/app-static/; \
 elif [ -d /app/out ]; then cp -R /app/out/. /opt/app-static/; \
 else echo "No static build output found. Expected one of: dist, build, out." >&2; exit 1; fi

FROM nginx:stable-alpine
COPY --from=build /opt/app-static/ /usr/share/nginx/html/
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
