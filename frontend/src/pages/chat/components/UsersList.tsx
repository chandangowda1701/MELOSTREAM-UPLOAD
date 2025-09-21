import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";

const UsersList = () => {
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();

	console.log('UsersList Debug:', { users, isLoading, selectedUser });

	return (
		<div className='border-r border-zinc-800'>
			<div className='flex flex-col h-full'>
				<ScrollArea className='h-[calc(100vh-280px)]'>
					<div className='space-y-2 p-4'>
						{isLoading ? (
							<UsersListSkeleton />
						) : users.length === 0 ? (
							<div className="text-center text-zinc-400">No users found</div>
						) : (
							users.map((user) => {
								console.log('Rendering user:', user);
								return (
									<div
										key={user._id}
										onClick={() => setSelectedUser(user)}
										className={`flex items-center gap-3 p-3 
											rounded-lg cursor-pointer transition-colors
											${selectedUser?.clerkid === user.clerkid ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}
									>
										<div className='relative'>
											<Avatar className='size-8 md:size-12'>
												<AvatarImage src={user.imageUrl} />
												<AvatarFallback>{user.fullname ? user.fullname[0] : '?'}</AvatarFallback>
											</Avatar>
											{/* online indicator */}
											<div
												className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900
													${onlineUsers.has(user.clerkid) ? "bg-green-500" : "bg-zinc-500"}`}
											/>
										</div>

										<div className='flex-1 min-w-0 overflow-hidden'>
											<span className='font-medium text-white truncate block'>
												{user.fullname || 'Unknown User'}
											</span>
										</div>
									</div>
								);
							})
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default UsersList;