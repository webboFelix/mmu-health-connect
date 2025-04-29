import { getEvents, deleteEvent } from "@/lib/actions";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { showToast } from "../react_toastfy/showToast";

export default async function EventsPage() {
  const events = await getEvents();
  const { userId } = await auth();

  return (
    <section className="p-6">
      <h1 className="text-3xl text-center font-bold mb-8">Upcoming Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            {event.imageUrl && (
              <div className="relative h-48 w-full">
                <Image
                  src={event.imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <p className="text-gray-500 text-sm mb-2">
                {format(new Date(event.schedule), "PPPpp")}
              </p>
              <p className="text-gray-700 flex-grow">{event.details}</p>

              {userId === event.userId ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded-md w-full mt-4"
                    >
                      Delete
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the event.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <form
                        action={async () => {
                          "use server";
                          try {
                            await deleteEvent(event.id);
                            showToast("success", <p>Deleted Successfully</p>);
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      >
                        <AlertDialogAction type="submit">
                          Confirm Delete
                        </AlertDialogAction>
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <button
                  type="button"
                  disabled
                  className="bg-gray-400 text-white text-sm py-2 px-4 rounded-md w-full cursor-not-allowed mt-4"
                >
                  You can't delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
