var Signup = function () {

    var image = 'public/images/bg3.jpg';
    var url = 'public/images/Files3DPreview.PNG';

    this.backgroundImage = div().addClass('backgroundImage').css(Styles.backgroundImageFull(image));
    this.signupContainer = div();
    this.titleBar = siteBar('Files 3D','Login',loginClick);
    this.contentRow = row().css(Styles.padding({t:'60px',r:'10%',l:'10%'}));
    this.infoCol = col(5).removeClass('text-center').addClass('text-left infoCol');
    this.imageCol = col(7);
    this.dimensionalWindow = dimensionalWindow();
    this.filesPreview =  dimensionalPanel().css('transform','rotateY(-20deg) translateZ(-150px)').css(Styles.backgroundImage(url));
    this.contentTitle = div().css('padding','15px').text('Files 3D').css(titleText());
    this.contentText = div().css(Styles.padding({a:'15px',t:'50px'})).height('325px').css(Styles.font({size:'30px',color:'white'}))
        .text("Meet the world's first 3D file manager in the cloud");
    this.buttonRow = row();
    this.signupCol = col(6);
    this.loginCol = col(6);
    this.signupButton = button('Signup').css(Styles.buttonText()).removeClass('ghost').addClass('cta').click(signupClick);
    this.loginButton = button('Login').css(Styles.buttonText()).click(loginClick);

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

var signupClick = function(){
    $('.infoCol').fadeOut(1000,function(){
        $(this).replaceWith((new SignupForm()).playKeyframe({name:'new-panel',duration:'1s',timingFunction:'ease'}));
    })
};

var loginClick = function(){
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
                        $.post('/files/home',{token:Token},function(data){
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
};

var SignupForm = function(){
    this.form = col(5);
    this.title = panelTitle('Signup').css('background',transparentBlack()).css('color','white');
    this.firstName  = input('First Name').addClass('inputWhite');
    this.lastName = input('Last Name').addClass('inputWhite');
    this.email = input('Email','email').addClass('inputWhite');
    this.password = input('Password','password').addClass('inputWhite');
    this.passwordVerify = input('Verify Password','password').addClass('inputWhite');
    this.submit = buttonCol('Submit','','12').click(submitClick);
    return this.form.append(
        this.title,
        this.firstName,
        this.lastName,
        this.email,
        this.password,
        this.passwordVerify,
        this.submit
    )
};

var submitClick = function(){

    //Get inputs

    var formData = {};
    $.each($('input'),function(){
        console.log($(this).val());
        formData[camelCase($(this).attr('placeholder'))] = $(this).val();
    });
    console.log(formData);

    $.post('/files/signup',{user:JSON.stringify(formData)},function(data){
        swal({title:data.message,type:data.type});
    });

};
