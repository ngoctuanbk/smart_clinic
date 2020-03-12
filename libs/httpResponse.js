module.exports = {
    response403: (res) => {
        res.writeHead(403, 'Forbidden', {
            'Content-Type': 'text/html',
        });
        res.write(`
                <html>
                    <head>
                        <meta charset="utf-8" />
                        <title>
                            Bạn không có quyền thực hiện thao tác này
                        </title>
                        <link rel="stylesheet" href="/assets/layouts/layout/css/error.css">
                    </head>
                    <body>
                        
                        <div class="page-err">
                            <div class="page-err-wrapper">
                                <h1>403</h1>
                                <h2>Bạn không có quyền thực hiện thao tác này!</h2>
                            </div>
                        </div>
                        
                    </body>
                </html>`);
        return res.end();
    },
    response404: (res) => {
        res.writeHead(404, 'Page Not Found', {
            'Content-Type': 'text/html',
        });
        res.write(`
                <html>
                    <head>
                        <meta charset="utf-8" />
                        <title>
                            Không tìm thấy trang bạn yêu cầu
                        </title>
                        <link rel="stylesheet" href="/assets/layouts/layout/css/error.css">
                    </head>
                    <body>
                        
                        <div class="page-err">
                            <div class="page-err-wrapper">
                                <h1>404</h1>
                                <h2>Không tìm thấy trang bạn yêu cầu!</h2>
                            </div>
                        </div>
                        
                    </body>
                </html>`);
        return res.end();
    },
};
