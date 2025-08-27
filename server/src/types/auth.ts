interface IRegisterBody {
  full_name: string;
  username: string;
  email: string;
  password: string;
}

interface ILoginBody {
  login: string;
  password: string;
}

export { IRegisterBody, ILoginBody }
