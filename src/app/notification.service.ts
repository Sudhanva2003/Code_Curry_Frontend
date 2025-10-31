import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  show(message: string, duration: number = 2500) {
    const alertBox = document.createElement('div');
    alertBox.innerText = message;
    alertBox.style.position = 'fixed';
    alertBox.style.top = '20px';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.backgroundColor = '#ffffff';
    alertBox.style.color = '#000000';
    alertBox.style.fontWeight = 'bold';
    alertBox.style.padding = '14px 28px';
    alertBox.style.borderRadius = '8px';
    alertBox.style.fontSize = '15px';
    alertBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    alertBox.style.zIndex = '9999';
    alertBox.style.opacity = '0';
    alertBox.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    alertBox.style.maxWidth = '400px';
    alertBox.style.textAlign = 'center';
    alertBox.style.wordWrap = 'break-word';
    alertBox.style.transform = 'translate(-50%, -20px)'; // start slightly above

    document.body.appendChild(alertBox);

    // fade + slide down
    setTimeout(() => {
      alertBox.style.opacity = '1';
      alertBox.style.transform = 'translate(-50%, 0)';
    }, 50);

    // fade out and slide up
    setTimeout(() => {
      alertBox.style.opacity = '0';
      alertBox.style.transform = 'translate(-50%, -20px)';
      setTimeout(() => document.body.removeChild(alertBox), 400);
    }, duration);
  }
}
