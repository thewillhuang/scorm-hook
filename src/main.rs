use actix_web::{web, App, HttpRequest, HttpServer, Responder};
use listenfd::ListenFd;
use actix_files as fs;
// use std::path::PathBuf;

fn index(_req: HttpRequest) -> impl Responder {
    "Hello World!"
}

// fn fileResponder(req: HttpRequest) -> Result<NamedFile> {
//     let path: PathBuf = req.match_info().query("filename").parse().unwrap();
//     Ok(NamedFile::open(path)?)
// }

fn main() {
    let mut listenfd = ListenFd::from_env();
    let mut server = HttpServer::new(|| App::new()
    .route("/", web::get().to(index))
    .service(fs::Files::new("/static", ".").show_files_listing())
);

    server = if let Some(l) = listenfd.take_tcp_listener(0).unwrap() {
        server.listen(l).unwrap()
    } else {
        server.bind("127.0.0.1:8088").unwrap()
    };

    server.run().unwrap();
}
