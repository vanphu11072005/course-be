import ProfileService from "../services/profile.service.js";

    class ProfileController {
    // GET /profile/me
    async getProfile(req, res) {
        try {
        const userId = req.user.id;
        const profile = await ProfileService.getProfile(userId);

        if (!profile) {
            return res.status(404).json({
            status: false,
            message: "Profile not found",
            });
        }

        res.json({
            status: true,
            message: "Fetched profile successfully",
            data: profile,
        });
        } catch (err) {
        console.error("❌ GET PROFILE ERROR:", err);
        res.status(500).json({ status: false, message: err.message });
        }
    }

    // PATCH /profile/me
    async updateProfile(req, res) {
        try {
        const userId = req.user.id;
        const data = req.body;

        const updatedProfile = await ProfileService.updateProfile(userId, data);

        if (!updatedProfile) {
            return res.status(404).json({
            status: false,
            message: "User not found",
            });
        }

        res.json({
            status: true,
            message: "Profile updated successfully",
            data: updatedProfile,
        });
        } catch (err) {
        console.error("❌ UPDATE PROFILE ERROR:", err);
        res.status(500).json({ status: false, message: err.message });
        }
    }
    }

    export const profileControler = new ProfileController();