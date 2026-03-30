import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import axios from "axios"
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { LogOut, X } from 'lucide-react'

function LogoutModal({ open, onClose }) {
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            onClose()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AnimatePresence>
            {open &&
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.88, opacity: 0, y: 60 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="relative w-full max-w-sm p-[1px] rounded-3xl bg-gradient-to-br from-red-500/40 via-orange-500/30 to-transparent"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='relative rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.8)] overflow-hidden' >
                            <motion.div
                                animate={{ opacity: [0.15, 0.3, 0.15] }}
                                transition={{ duration: 6, repeat: Infinity }}
                                className="absolute -top-32 -left-32 w-80 h-80 bg-red-500/30 blur-[140px]"
                            />
                            
                            <button
                                className='absolute top-5 right-5 z-20 text-zinc-400 hover:text-white transition'
                                onClick={onClose}
                            >
                                <X size={20} />
                            </button>

                            <div className='relative px-8 pt-10 pb-8 text-center'>
                                <div className='mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6'>
                                    <LogOut className="text-red-400" size={28} />
                                </div>
                                
                                <h2 className='text-2xl font-semibold leading-tight mb-2'>
                                    Sign Out
                                </h2>
                                
                                <p className='text-sm text-zinc-400 mb-8 max-w-[250px] mx-auto'>
                                    Are you sure you want to sign out of your account?
                                </p>

                                <div className='flex gap-3'>
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleLogout}
                                        className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-xl transition"
                                    >
                                        Yes, Sign Out
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>}
        </AnimatePresence>
    )
}

export default LogoutModal
