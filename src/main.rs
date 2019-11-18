use actix_cors::Cors;
use actix_files as fs;
use actix_web::{http, middleware, web, App, HttpRequest, HttpServer, Responder};
// use env_logger;
use listenfd::ListenFd;

fn index(_req: HttpRequest) -> impl Responder {
    "Hello World!"
}

// fn fileResponder(req: HttpRequest) -> Result<NamedFile> {
//     let path: PathBuf = req.match_info().query("filename").parse().unwrap();
//     Ok(NamedFile::open(path)?)
// }

fn main() {
    // std::env::set_var("RUST_LOG", "actix_web=info");
    // env_logger::init();
    let mut listenfd = ListenFd::from_env();
    let mut server = HttpServer::new(|| {
        App::new()
            // .wrap(middleware::Logger::default())
            .wrap(middleware::Compress::default())
            .wrap(
                Cors::new() // <- Construct CORS middleware builder
                    .allowed_origin("All")
                    .allowed_methods(vec!["GET", "OPTIONS", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![
                        http::header::AUTHORIZATION,
                        http::header::ACCEPT,
                    ])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .max_age(3600),
            )
            .route("/", web::get().to(index))
            .service(
                fs::Files::new("/courses", "./courses/")
                    .show_files_listing()
                    .use_etag(true)
                    .use_last_modified(true),
            )
    });

    server = if let Some(l) = listenfd.take_tcp_listener(0).unwrap() {
        server.listen(l).unwrap()
    } else {
        server.bind("127.0.0.1:8088").unwrap()
    };

    server.run().unwrap();
}
