var Signup = function () {
    var image = 'public/images/bg3.jpg';
    var url = 'public/images/Files3DPreview.PNG';
    this.backgroundImage = div().addClass('backgroundImage').css(Styles.backgroundImage(image));
    this.signupContainer = div();

    this.titleBar = siteBar('Files 3D','Login',function(data){

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
        swal.queue(steps).then(function (result) {
            swal.resetDefaults();
            $.post('/files/login', {username: result[0], password: result[1]})
                .done(function (data) {
                    console.log(data);
                    if (data.success) {
                        Token = data.token;
                        sessionStorage.setItem('token',data.token);
                        sessionStorage.setItem('folder',data.data.userFolder);
                        swal({title: data.message, type: 'success',onClose:function(){
                            $.post('/files/list',{token:Token},function(data){
                                console.log(data);
                                var WA = new WebApp();
                                WA.assemble(data);
                            });
                        }});
                    }
                    else {
                        swal({title: data.message, type: 'error'})
                    }
                });
        }, function () {
            swal.resetDefaults();
        });
    });

    this.contentRow = row().css('padding-top','60px').css('padding-right','10%').css('padding-left','10%');
    this.infoCol = col(5);
    this.imageCol = col(7);
    this.dimensionalWindow = div().css('transform-style','preserve-3d').css('perspective','50em');
    this.filesPreview =  dimensionalPanel().css('transform','rotateY(-20deg) translateZ(-150px)').css('background-image','url('+ url +')').css('background-size','cover');
    this.contentTitle = div().css('padding','15px').removeClass('text-center').addClass('text-left').text('Files 3D').css(titleText());
    this.contentText = div().css('padding','15px').css('padding-top','50px').removeClass('text-center').addClass('text-left').height('325px')
        .css('font-family','Open Sans Condensed').css('color','white').text("Meet the world's first 3D file manager in the cloud").css('font-size','30px');
    this.buttonRow = row();
    this.signupCol = col(6);
    this.loginCol = col(6);
    this.signupButton = button('Signup').removeClass('ghost').addClass('cta').css(buttonText());
    this.loginButton = button('Login').css('letter-spacing','6px').css(buttonText()).click(function(){

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
            swal.queue(steps).then(function (result) {
                swal.resetDefaults();
                $.post('/files/login', {username: result[0], password: result[1]})
                    .done(function (data) {
                        console.log(data);
                        if (data.success) {
                            Token = data.token;
                            sessionStorage.setItem('token',data.token);
                            sessionStorage.setItem('folder',data.data.userFolder);
                            swal({title: data.message, type: 'success',onClose:function(){
                                $.post('/files/list',{token:Token},function(data){
                                    console.log(data);
                                    var WA = new WebApp();
                                    WA.assemble(data);
                                });
                            }});
                        }
                        else {
                            swal({title: data.message, type: 'error'})
                        }
                    });
            }, function () {
                swal.resetDefaults();
            });
        });

    this.footer = div();

    return $('body').empty().append(
        this.backgroundImage,
        this.signupContainer.append(
            this.titleBar,
            this.contentRow.append(
                this.infoCol.append(
                    this.contentTitle,
                    this.contentText,
                    this.buttonRow.append(
                        this.signupCol.append(this.signupButton),
                        this.loginCol.append(this.loginButton)
                    )
                ),
                this.imageCol.append(
                    this.dimensionalWindow.append(this.filesPreview)
                )
            )
        )
    )
};
