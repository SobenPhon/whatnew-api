import { LoginStyle } from "./Login.styled"
import { useState } from "react"
import { Link } from 'react-router-dom'
import { useLogin } from "../../hook/useLogin"
import { TbExternalLink } from 'react-icons/tb'
import { HiOutlineMail } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isLoading, message } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(email, password)
  }

  return (
    <LoginStyle>
      <form onSubmit={handleSubmit}>
        <div className="head-area">
          <div className="text-area">
            <h1 className="title">ចូលប្រើគណនី</h1>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email"><HiOutlineMail /> អ៉ីម៉ែល</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            id="email"
            autoComplete="username" />
        </div>

        <div className="form-group">
          <label htmlFor="password"><RiLockPasswordLine /> ពាក្យសម្ងាត់</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            id="password"
            autoComplete="current-password" />
        </div>

        <div className="btn-right">
          <button disabled={isLoading} className='btn-submit'>ចូលប្រើគណនី</button>
        </div>

        <div className="login-footer">
          <Link to='/' className="goto-link"><TbExternalLink /> Goto Site</Link>
          {error && <div className="error">{error}</div>}
          {message && <div className="message">{message}</div>}
        </div>
      </form>
    </LoginStyle>
  )
}
