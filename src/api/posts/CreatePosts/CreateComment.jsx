import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";

export function CreateComment({ postId, Token, userData }) {
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            content: '',
        },
    });

    // createComment Function
async function createComment(values) {
    return await axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        { content: values.content },
        {
            headers: {
                token:Token,
            },
        }
    );
}
    // createComment Mutation
const { mutate , error } = useMutation({
        mutationKey:['CreateComment'],
        mutationFn: createComment,
        onSuccess: () => {
            reset();
            queryClient.invalidateQueries({ queryKey: ['Posts'] })
        },

    });



    return (
        <div className="mx-2 xs:mx-3 sm:mx-6 mt-3 mb-5 flex items-center gap-1.5 sm:gap-2.5">
            <img src={userData?.photo} className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" alt="You" />
            <form onSubmit={handleSubmit(mutate)} className="flex-1 min-w-0 flex items-center bg-[#EFE7D6] rounded-full pl-2.5 xs:pl-3 sm:pl-4 pr-1 xs:pr-1.5 py-1 sm:py-1.5">
                <input type="text" {...register('content')} placeholder="Create Comment" className="flex-1 min-w-0 border-0 bg-transparent outline-none text-xs sm:text-sm text-[#24211B] focus:ring-0 placeholder:text-[#6B6456] truncate" />
                <button type="submit" className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#C4562A] text-[#FBF8F1] hover:opacity-90 active:scale-95 transition shrink-0">
                    <svg width="11" height="11" className="xs:w-[13px] xs:h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                </button>
            </form> 
            </div>
    );
}