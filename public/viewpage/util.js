import { modalInfobox } from "./elements.js";

export function info(title, body, closemodal) {
  if (closemodal) closemodal.hide();
  modalInfobox.title.innerHTML = title;
  modalInfobox.body.innerHTML = body;
  modalInfobox.modal.show();
}
