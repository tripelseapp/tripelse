# Sobre el manejo de errores en servicios y controladores en NestJS

En una aplicación construida con NestJS (o en general en cualquier aplicación bien estructurada), es importante mantener una clara separación de responsabilidades entre los controladores y los servicios. Los controladores deben encargarse de manejar las solicitudes HTTP y devolver las respuestas adecuadas, mientras que los servicios deben encargarse de la lógica de negocio y las operaciones con datos.

Recomendación
La elección entre estas dos estrategias depende de tus necesidades y preferencias. Sin embargo, mantener los servicios simples y centrados en la lógica de negocio (devolviendo null cuando no se encuentra un dato) y dejando que el controlador maneje las excepciones específicas es una práctica común y recomendada. Esto permite que los servicios sean más reutilizables y menos acoplados a la lógica específica de la presentación o manejo de errores HTTP.

Por lo tanto, mi recomendación es:

1. Servicios: Devolver null si no se encuentra el usuario.
2. Controladores: Manejar el caso null y lanzar las excepciones HTTP adecuadas.

Esto mantiene una clara separación de responsabilidades y hace que el código sea más fácil de mantener y probar.
