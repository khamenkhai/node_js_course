import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {

	console.log(req.headers.cookies);
	console.log(req.cookies);
	console.log(req.signedCookies);

	if (req.signedCookies.hello && req.signedCookies.hello === "world") {
		return res.send([
			{ id: 123, name: "Chicken Breast", price: 12.99 },
			{ id: 456, name: "Salmon Fillet", price: 14.5 },
			{ id: 789, name: "Ribeye Steak", price: 22.0 }
		]);
	}
	return res.send({ msg : "Sorry, You need the correct cookie!"})

});

export default router;
