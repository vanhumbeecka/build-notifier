const electronPublish = require('electron-publish');
const gcs =  require('@google-cloud/storage');
const path = require('path')

class Publisher extends electronPublish.Publisher {

    constructor(context, config) {
        super(context);

        this.config = config;
        this.storage = new gcs.Storage({
            autoRetry: true,
            keyFile: config.serviceAccount,
            projectId: config.serviceAccount.project_id
        });
        this.bucket = this.storage.bucket(config.bucket);
    }

    async upload(task) {
        console.log('electron-publisher-custom', task.file);
        const fileName = path.basename(task.file)
        // // e.g. latest-mac.yml should not be cached for long
        const shortCache = fileName.endsWith(".yml")

        try {
            await this.bucket.upload(task.file, {
                // Support for HTTP requests made with `Accept-Encoding: gzip`
                gzip: true,
                // By setting the option `destination`, you can change the name of the
                // object you are uploading to a bucket.
                predefinedAcl: undefined,
                destination: fileName,
                metadata: {
                    // Enable long-lived HTTP caching headers
                    // Use only if the contents of the file will never change
                    // (If the contents will change, use cacheControl: 'no-cache')
                    cacheControl: shortCache ? 'public, max-age=3600' : 'public, max-age=31536000'
                },
            });
        } catch (e) {
            console.error(e)
            console.error("-----")
        }
    }

    toString() {
        return `${this.providerName} (bucket: ${this.config.bucket})`;
    }
};

module.exports = Publisher;
