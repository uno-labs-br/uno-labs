console.error('Publicação bloqueada: a configuração legada serve public/. O frontend Astro gera dist/. A integração da hospedagem oficial e do backend exige tarefa posterior e autorização de publicação.');
process.exitCode = 1;
