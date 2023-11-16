import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchTerm: string = '';

  onSearch() {
    // Здесь вы можете обработать поисковый запрос, например, отправить его на сервер или фильтровать данные.
    console.log('Search term:', this.searchTerm);
  }
}
