//
//  Alamofire.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Alamofire
import Foundation

let API: Session = {
    let configuration = URLSessionConfiguration.af.default
    configuration.timeoutIntervalForRequest = 30

    return Session(configuration: configuration, interceptor: RequestInterceptor())
}()

// Mark
final class RequestInterceptor: Alamofire.RequestInterceptor {
    func adapt(_ urlRequest: URLRequest, for _: Session, completion: @escaping (Result<URLRequest, Error>) -> Void) {
//        guard urlRequest.url?.absoluteString.hasPrefix("https://api.authenticated.com") == true else {
//            /// If the request does not require authentication, we can directly return it as unmodified.
//            return completion(.success(urlRequest))
//        }
        var urlRequest = urlRequest

        debugPrint(urlRequest)
        // Set the Authorization header value using the access token.
        urlRequest.setValue(TokenManager.shared.getIdToken(), forHTTPHeaderField: "Authorization")

        completion(.success(urlRequest))
    }

    func retry(_: Request, for _: Session, dueTo error: Error, completion _: @escaping (RetryResult) -> Void) {
        debugPrint("retry", error)
//        guard let response = request.task?.response as? HTTPURLResponse, response.statusCode == 401 else {
//            /// The request did not fail due to a 401 Unauthorized response.
//            /// Return the original error and don't retry the request.
//            return completion(.doNotRetryWithError(error))
//        }

//        print(error)

//        refreshToken { [weak self] result in
//            guard let self = self else { return }
//
//            switch result {
//            case .success(let token):
//                self.storage.accessToken = token
//                /// After updating the token we can safely retry the original request.
//                completion(.retry)
//            case .failure(let error):
//                completion(.doNotRetryWithError(error))
//            }
//        }
    }
}

extension Session {
    func downloadFile(filename _: String) {}
}
