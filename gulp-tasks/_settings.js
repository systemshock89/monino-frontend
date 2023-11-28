function settings() {

    return {
        proxy: '',
        ssh: {
            site: {
                hostname: "username@yousite.com",
                destination: "www/site.ru/",
            },
            template: {
                hostname: "username@yousite.com",
                destination: "www/site.ru/",
            },
        },
        ftp: {
            site: {
                host: "hosting.com",
                user: "login",
                pass: "********",
                folderPath: "/www/site.ru",
            },
            cmsnc: {
                host: "hosting.com",
                user: "login",
                pass: "********",
                folderPath: "/www/site.ru",
            },
            wiki: {
                host: "hosting.com",
                user: "login",
                pass: "********",
                folderPath: "/www/site.ru",
            },
        },
    };
}
// settings();

export default settings;