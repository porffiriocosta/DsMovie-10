package com.devsuperior.movieflix.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devsuperior.movieflix.dto.ReviewDTO;
import com.devsuperior.movieflix.entities.Movie;
import com.devsuperior.movieflix.entities.Review;
import com.devsuperior.movieflix.entities.User;
import com.devsuperior.movieflix.repositories.ReviewRepository;

@Service
public class ReviewService {
	
	@Autowired
	private ReviewRepository repository;
	
	@Autowired
	private AuthService authService;
	
	@Transactional(readOnly = true)
	public List<ReviewDTO> findByMovieId(Long movieId) {
		List<Review> list = repository.findByMovieId(movieId);
		return list.stream().map(x -> new ReviewDTO(x)).collect(Collectors.toList());
	}

	@Transactional
	public ReviewDTO insert(ReviewDTO dto) {
		Review entity = new Review();
		entity.setText(dto.getText());
		entity.setMovie(new Movie(dto.getMovieId()));
		
		User user = authService.athutenticated();
		entity.setUser(user);
		
		entity = repository.save(entity);
		return new ReviewDTO(entity);
	}
}
