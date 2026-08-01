import IconComment from './IconComment'

export default function Comment({ avatar, username, time, text }) {
  return (
    <div className="flex items-start gap-3 border-t border-[#E8E2D7] pt-4 mt-4">
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
        <img src={avatar} alt={username} className="w-10 h-10 object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#24211B]">{username}</p>
            <p className="text-xs text-[#6B6456]">{time}</p>
          </div>
          <div className="text-sm text-[#6B6456] flex items-center gap-2">
            <span className="flex items-center gap-1"> <IconComment /> 1</span>
          </div>
        </div>
        <p className="mt-2 text-[14px] text-[#24211B] leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
