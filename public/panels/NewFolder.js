var NewFolder = function (name) {

    var prototype = {Name:''};
    var self = this;
    this.newFilePanel = dimensionalPanel();
    this.panelTitleBar = panelTitle('Add '+name);
    this.uploadInput = input('Folder','file').css('display','none').attr('webkitdirectory','webkitdirectory').attr('multiple','multiple');
    this.upload =  button('Upload '+name).css('font-size','18px').css('margin','0').css('max-width','100%').removeClass('cta').addClass('rev text-center').width('100%').click(function(){
        self.uploadInput.click();
    });
    this.or = div().width('100%').addClass('text-center').append(highlightText('Or')).css('font-size','26px').css('padding','20px');
    this.submit = button('Create new '+name).css('font-size','18px').css('margin','0').css('max-width','100%').addClass('cta text-center').width('100%').click(function(){
        var inputs = $('input');
        var inputObject = {};
        $.each(inputs,function () { inputObject[ $(this).attr('placeholder') ] = $(this).val(); });

        // $.post('/files/update',data,function (data) {
        //     swal.resetDefaults();
        //     swal({title:data.message,type:'success',timer:2000});
        //      //Dequeue panel
        // });

    });

    this.inputs = div();

    for(var k in prototype){
        this.inputs.append(new input(k))
    }

    return this.newFilePanel.append(
        this.panelTitleBar,
        this.upload,
        this.uploadInput,
        this.or,
        this.inputs,
        this.submit
    );

};