import { User } from "../entities/User";
import { Notification } from "../entities/Notification";

//

export const setNotificationToUnread = async (_id) => {
  try {
    const user = await User.findById(_id);

    if (!user.unreadNotification) {
      user.unreadNotification = true;
      await user.save();
    }

    return;
  } catch (error: any) {
    console.log(error);
  }
};

export const newLikeNotification = async (_id, postId, userToNotifyId) => {
  try {
    const userToNotify = await Notification.findOne({ user: userToNotifyId });

    const newNotification = {
      type: "newLike",
      user: _id,
      post: postId,
      date: Date.now(),
    };

    userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error: any) {
    console.log(error);
  }
};

export const removeLikeNotification = async (_id, postId, userToNotifyId) => {
  try {
    const user = await Notification.findOne({ user: userToNotifyId });

    const notificationRemove = user.notifications.find((notification: any) => {
      notification.type === "newLike" &&
        String(notification.post) === postId &&
        String(notification.user) === _id;
    });

    const indexof = user.notifications
      .map((notification) => String(notification._id))
      .indexOf(String(notificationRemove._id));

    user.notifications.splice(indexof, 1);

    await user.save();

    return;
  } catch (error: any) {
    console.log(error);
  }
};

export const newCommentNotification = async (
  postId,
  commentId,
  _id,
  userToNotifyId,
  text
) => {
  try {
    const userToNotify = await Notification.findOne({ user: userToNotifyId });

    const newNotification = {
      type: "newComment",
      user: _id,
      post: postId,
      date: Date.now(),
      commentId,
      text,
    };

    userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();

    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error: any) {
    console.log(error);
  }
};

export const removeCommentNotification = async (
  postId,
  commentId,
  _id,
  userToNotifyId
) => {
  try {
    const user = await Notification.findOne({ user: userToNotifyId });

    const notificationRemove = user.notifications.find((notification: any) => {
      notification.type === "newComment" &&
        String(notification.post) === postId &&
        String(notification.user) === _id &&
        notification.commentId === commentId;
    });

    const indexof = user.notifications
      .map((notification) => String(notification._id))
      .indexOf(String(notificationRemove._id));

    user.notifications.splice(indexof, 1);

    await user.save();

    return;
  } catch (error: any) {
    console.log(error);
  }
};
//

export const newFollowerNotification = async (_id, userToNotifyId) => {
  try {
    const user = await Notification.findOne({ user: userToNotifyId });

    const newNotification = {
      type: "newFollower",
      user: _id,

      date: Date.now(),
    };

    user.notifications.unshift(newNotification);
    await user.save();

    await setNotificationToUnread(userToNotifyId);

    return;
  } catch (error: any) {
    console.log(error);
  }
};

export const removeFollowerNotification = async (_id, userToNotifyId) => {
  try {
    const user = await Notification.findOne({ user: userToNotifyId });

    const notificationRemove = user.notifications.find((notification: any) => {
      notification.type === "newFollower" && String(notification.user) === _id;
    });

    const indexof = user.notifications
      .map((notification) => String(notification._id))
      .indexOf(String(notificationRemove._id));

    user.notifications.splice(indexof, 1);

    await user.save();

    return;
  } catch (error: any) {
    console.log(error);
  }
};
