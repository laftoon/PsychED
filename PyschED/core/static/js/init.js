document.addEventListener("DOMContentLoaded", () => {
  new MobileMenu();
  new HeroHandler();
  new TouchHandler();
  new ExpandableCardHandler();
  new CarouselHandler(); // <-- This is the missing piece
});
