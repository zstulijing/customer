import axios from 'axios';
export function request(config) {
  return (axios.create({
    timeout: 50000
  }))(config)
}
