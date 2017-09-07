var DirectoryCard = function (directoryData) {

    this.directoryCard = div();
    this.hoverGallery  = hoverGallery(directoryData.images);
    return this.directoryCard;

};