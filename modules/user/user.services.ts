import { prisma } from "../../src/lib/prisma";

const getUserDashboardData = async (userId: string) => {
  const [profile, purchases, watchlists, reviews] = await Promise.all([
    // ১. ইউজারের বেসিক প্রোফাইল
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true, createdAt: true }
    }),
    // ২. কেনা বা রেন্ট করা মুভি (Active access গুলো)
    prisma.purchase.findMany({
      where: { 
        userId,
        OR: [
          { type: "BUY" },
          { type: "RENT", expiresAt: { gt: new Date() } }
        ]
      },
      include: { movie: { select: { id: true, title: true, posterUrl: true, type: true } } },
      orderBy: { createdAt: "desc" }
    }),
    // ৩. ওয়াচলিস্ট
    prisma.watchlist.findMany({
      where: { userId },
      include: { movie: { select: { id: true, title: true, posterUrl: true, ratingAverage: true } } }
    }),
    // ৪. ইউজারের দেওয়া শেষ ৫টি রিভিউ
    prisma.review.findMany({
      where: { userId },
      take: 5,
      include: { movie: { select: { title: true } } },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return { profile, purchases, watchlists, reviews };
};

const updateProfile = async (userId: string, data: { name?: string; image?: string }) => {
  return await prisma.user.update({
    where: { id: userId },
    data
  });
};

export const userService = {
  getUserDashboardData,
  updateProfile
};