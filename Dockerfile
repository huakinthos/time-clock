FROM nginx
COPY ./docs/.vuepress/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/*
COPY ./default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
