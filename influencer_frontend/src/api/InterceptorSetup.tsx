import { useAxiosInterceptors } from './setupInterceptors';

export default function InterceptorSetup() {
  useAxiosInterceptors();
  return null;
}
