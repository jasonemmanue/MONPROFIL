# Site statique servi par le serveur httpd de BusyBox : image d'environ 5 Mo, moins de 2 Mo de RAM
FROM busybox:1.36.1
COPY httpd.conf /etc/httpd.conf
COPY site /www
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "exec httpd -f -p 0.0.0.0:${PORT} -h /www -c /etc/httpd.conf"]
