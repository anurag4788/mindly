import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import DiaryListPage from '../pages/DiaryListPage'
import DiaryEditorPage from '../pages/DiaryEditorPage'
import ProtectedRoute from '../components/ProtectedRoute'
import DiaryDetailPage from '../pages/DiaryDetailPage'
import AuthPage from '../pages/AuthPage'


export default function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/auth' element={<AuthPage />} />
                <Route element={<ProtectedRoute />} >
                    <Route path='/diary' element={<DiaryListPage />} />
                    <Route path='/diary/:id' element={<DiaryDetailPage/>} />
                    <Route path='/diary/edit/:id' element={<DiaryEditorPage />} />

                </Route>
            </Routes>
        </>
    )
}