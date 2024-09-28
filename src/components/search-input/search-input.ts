import SearchInputTemplate from "./search-input.hbs?raw";
import { Events } from "../common/block";
import { Input } from "../common/input";

interface SearchInputProps extends Record<string, unknown> {
  value: string;
  events: Events;
  _id: string;
}

export class SearchInput extends Input<SearchInputProps> {

  render() {
    return SearchInputTemplate;
  }
}
