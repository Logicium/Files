var FaceMatrix = function(faces){
    this.faceMatrix = div().addClass('faceMatrix').css('perspective','100em');
    this.faceMatrix.append(new FacePanel(faces));
    return this.faceMatrix;
};

var FacePanel = function (FaceData) {
    var self = this;
    this.facePanel = div().css('position','absolute').addClass('facePanel').css('background',transparentWhite())
        .css('padding','10px').css('margin','10px').css('min-height','600px').css('width','95%');
    this.buttonClick = function(formInputs){

        var formData = formInputs;

        return function(){
            var parentButton = $(this);
            var parentMatrix = parentButton.parent().parent().parent();
            parentMatrix.prepend(new GridFace())
        }

    };

    this.panelTitleBar = panelTitle(FaceData.name);

    this.searchBar = input('Search '+ FaceData.children.length+' items in '+FaceData.name).addClass('search');

    this.newFolderButton = buttonCol('Add Folder','folder',3).removeClass('cta').addClass('rev').css('color',transparentBlack()).click(function(){

        var newfolderData = {name:'Folder'};

        var nr = new NaviRow('New '+newfolderData.name);
        $('.levelNavi').append(nr.playKeyframe(
            {name:'expand-height',duration:'1s',timingFunction:'ease'},function(){
                $.each($('.naviRow'),function () {
                    $(this).resetKeyframe(function(){});
                    setTimeout(function(){$($(this).find('.levelFace')).resetKeyframe(function(){});},1000);
                });
                $('.levelFace:last').playKeyframe(
                    {name:'new-level',duration:'1s',timingFunction:'ease'}
                );
            }));

        var transformValue = 0;
        $.each( $('.facePanel') ,function(){
            transformValue = transformValue - 1500;
            $(this).css('z-index',transformValue).css('transition','2s ease').css('animation-delay',transformValue/10+'ms')
                .css({'transform':'translateY(300px) translateZ('+transformValue+'px)'});
        });

        $('.faceMatrix').prepend(new NewFolder(newfolderData.name,FaceData._id).playKeyframe({
            name:'new-panel',duration:'1s',timingFunction:'ease',complete:function(){$(this).resetKeyframe()}
        }));

    });

    this.newFileButton = buttonCol('Add Files','file',3).removeClass('cta').addClass('rev').css('color',transparentBlack()).click(function(){
        var newData = {name:'Files'};

        var nr = new NaviRow('New '+newData.name);
        $('.levelNavi').append(nr.playKeyframe(
            {name:'expand-height',duration:'1s',timingFunction:'ease'},function(){
                $.each($('.naviRow'),function () {
                    $(this).resetKeyframe(function(){});
                    setTimeout(function(){$($(this).find('.levelFace')).resetKeyframe(function(){});},1000);
                });
                $('.levelFace:last').playKeyframe(
                    {name:'new-level',duration:'1s',timingFunction:'ease'}
                );
            }));

        var transformValue = 0;
        $.each( $('.facePanel') ,function(){
            transformValue = transformValue - 1500;
            $(this).css('z-index',transformValue).css('transition','2s ease').css('animation-delay',transformValue/10+'ms')
                .css({'transform':'translateY(300px) translateZ('+transformValue+'px)'});
        });

        $('.faceMatrix').prepend(new NewFile(newData.name,FaceData._id).playKeyframe({
            name:'new-panel',duration:'1s',timingFunction:'ease',complete:function(){$(this).resetKeyframe()}
        }));

    });

    var AscendingButton = function(data){
        self.directories.empty();
        self.files.empty();
        for(var index in FaceData.children){
            if(FaceData.children[index].type === 'folder'){
                self.directories.append(new DirectoryCard(FaceData.children[index]))
            }
            else if(FaceData.children[index].type === 'file'){
                self.files.append(new FileCard(FaceData.children[index]))
            }
        }
          return buttonCol('Ascending','arrow-up',3).click(function(){
              $(this).replaceWith( new DescendingButton(data))
          });
      }

      var DescendingButton = function(data){
          var rev = data.reverse();
          self.directories.empty();
          self.files.empty();
          for(var index in FaceData.children){
              if(FaceData.children[index].type === 'folder'){
                  self.directories.append(new DirectoryCard(FaceData.children[index]))
              }
              else if(FaceData.children[index].type === 'file'){
                  self.files.append(new FileCard(FaceData.children[index]))
              }
          }
          return buttonCol('Descending','arrow-down',3).addClass('descending').click(function(){
              $(this).replaceWith( new AscendingButton(data.reverse()))
          });
      }
    //this.sortButton = buttonCol('Sort','sync',3).css('color','white');

    this.toolBar = row();
    this.directories = div();
    this.files = row();

    this.orderButton = new AscendingButton(FaceData.children);

    this.sortButton = col(3).append( select('Sort By',['name','type','created']).on('change', function() {
        var key = this.value;
        FaceData.children = _.sortBy(FaceData.children,function (text) { console.log(text); return (text[key]+'').toLowerCase(); })
        if($('.descending').length>0){FaceData.children = FaceData.children.reverse()}
        self.directories.empty();
        self.files.empty();
        for(var index in FaceData.children){
            if(FaceData.children[index].type === 'folder'){
                self.directories.append(new DirectoryCard(FaceData.children[index]))
            }
            else if(FaceData.children[index].type === 'file'){
                self.files.append(new FileCard(FaceData.children[index]))
            }
        }
    }).css({'background-color':transparentBlack(),'color':'white'}) );

    return this.facePanel.append(
        this.panelTitleBar,
        this.searchBar,
        this.toolBar.append(
            this.newFolderButton,
            this.newFileButton,
            this.sortButton,
            this.orderButton
        ),
        this.directories,
        this.files
    )
};
