function swapStayImage(thumbnailElement) {
    const mainImage = document.getElementById('main-img');
    mainImage.src = thumbnailElement.src;

    const allThumbnails = document.querySelectorAll('.thumbnail');
    allThumbnails.forEach(thumb => {
        thumb.classList.remove('active');
    });

    thumbnailElement.classList.add('active');
}