var CropImg = function(img_preview_container_id, options) {
    var self = this;
    var default_options = {
        viewport: {
            width: 600,
            height: 400
        },
        boundaryRatio: 1.5,
        targetRatio: 1
    }
    var boundarySize, targetSize;
    change(options);

    self.cropApp = null;
    self.imageSrc = '';
    self.readFile = function(file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var imgtmp = new Image();
            imgtmp.src = e.target.result;
            imgtmp.onload = function() {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                canvas.width = imgtmp.naturalWidth;
                canvas.height = imgtmp.naturalHeight;
                context.drawImage(imgtmp, 0, 0, canvas.width, canvas.height);
                var newImageData = canvas.toDataURL(file.type);
                self.imageSrc = newImageData;
                preview();
            }
        };
        reader.readAsDataURL(file);
    }
    self.loadOnlineImage = function(url) {
        self.imageSrc = url;
        preview();
    }
    self.getResult = function(callback) {
        if (!self.cropApp) return;
        self.cropApp.result({
            type: 'canvas',
            size: targetSize,
            format: 'jpeg',
            quality: 0.95
        }).then(function(resp) {
            if (callback) {
                callback(resp);
            }
        });
    }
    self.rotate = function(degree) {
        if (!self.cropApp) return;
        self.cropApp.rotate(degree);
    }
    self.change = change;

    function preview() {
        if (!self.imageSrc) return;
        $('#' + img_preview_container_id).html('<img id="preview" src="" alt="Image preview" />');
        var imgPreview = document.getElementById('preview');
        imgPreview.src = self.imageSrc;
        imgPreview.onload = function(ev) {
            self.cropApp = new Croppie(document.getElementById('preview'), {
                showZoomer: false,
                viewport: default_options.viewport,
                boundary: boundarySize,
                enableOrientation: true
            });
        }
    }

    function change(options) {
        if (options) {
            $.extend(default_options, options);
        }
        boundarySize = {
            width: default_options.viewport.width * default_options.boundaryRatio,
            height: default_options.viewport.height * default_options.boundaryRatio
        };
        targetSize = {
            width: default_options.viewport.width * default_options.targetRatio,
            height: default_options.viewport.height * default_options.targetRatio
        };
        // $('#' + img_preview_container_id).height(boundarySize.height);
        preview();
    }
}
