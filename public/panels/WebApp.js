var Token = sessionStorage.getItem('token');
var folderPath = sessionStorage.getItem('folder');

var WebApp = function(){

    //var s = new Signup();

    var homeImage = 'public/images/bg4.jpg';

    this.backgroundImage = div().addClass('backgroundImage');
    this.backgroundImage.css(Styles.backgroundImageFull(homeImage));
    this.contentRow = row().addClass('contentRow');
    this.naviCol = col(3);
    this.contentCol = col(9);
    this.contentContainer = div().addClass('text-center')
};

WebApp.prototype = {

    login: function(){

        var self = this;

        swal.setDefaults({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: false,
            showLoaderOnConfirm:true,
            animation: false,
            allowOutsideClick: false,
            progressSteps: ['1', '2']
        });

        var steps = [
            {
                title: 'Login',
                text: 'Enter your username below'
            },
            {
                title: 'Password',
                input:'password',
                showLoaderOnConfirm: true,
                text: 'Enter your password below'
            }
        ];

        if(Token === null || Token === 'null') {
            swal.queue(steps).then(function (result) {
                swal.resetDefaults();
                $.post('/files/login', {username: result[0], password: result[1]})
                    .done(function (data) {
                        console.log(data);
                        if (data.success) {
                            Token = data.token;
                            sessionStorage.setItem('token',data.token);
                            sessionStorage.setItem('folder',data.data.userFolder);
                            swal({title: data.message, type: 'success'});

                            $.post('/files/home',{token:Token},function(data){
                                console.log(data);
                                self.assemble(data);
                            });

                        }
                        else {
                            swal({title: data.message, type: 'error'})
                        }
                    });
            }, function () {
                swal.resetDefaults();
            });
        }
        else{
            console.log(folderPath);
            $.post('/files/home',{token:Token},function(data){
                console.log(data);
                self.assemble(data);
            });
        }
    },

    assemble: function(data){
        $('body').empty().append(
            this.backgroundImage,
            this.contentContainer.append(
                siteBar('Files'),
                this.contentRow.append(
                    this.naviCol.append(
                        new LevelNavi(data.name)
                    ),
                    this.contentCol.append(
                        new FaceMatrix(data))
                )
            )
        ).css('overflow-y','auto');
    }
};
