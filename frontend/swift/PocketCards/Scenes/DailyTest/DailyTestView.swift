//
//  DailyTestView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/09.
//
import SwiftUI

struct DailyTestView: View {
    var interactor: DailyTestBusinessLogic?
    private var subject: String

    @ObservedObject var viewModel: DailyTestViewModel

    init(subject: String) {
        self.subject = subject
        viewModel = DailyTestViewModel()
    }

    var body: some View {
        if viewModel.isLoading {
            Text("Loading....")
                .onAppear {
                    interactor?.loadQuestion()
                }
        } else if viewModel.isFinish {
            Text("今日のテストは終わりました")
                .font(.system(size: 64, design: .default))
        } else {
            // Language
            if subject == SUBJECT.LANGUAGE {
//                ChoiceQuestion(
//                    question: viewModel.title,
//                    choices: viewModel.choices,
//                    isShowError: "",
//                    onChoice: interactor!.onChoice
//                )
            } else {
                // Society or Science
//                FlashCard(
//                    question: viewModel.title,
//                    answer: viewModel.answer,
//                    action: interactor!.onAction,
//                    onPlay: interactor!.onPlay
//                )

                FlashCard(question: viewModel.question!, action: interactor!.onAction)
            }
        }
    }
}

extension DailyTestView: DailyTestDisplayLogic {
    func showNext(q: Question) {
        viewModel.question = q
        viewModel.isLoading = false
    }

    func showNothing() {
        viewModel.isFinish = true
    }
}

extension DailyTestView {
    func configureView() -> some View {
        var view = self
        let interactor = DailyTestInteractor(subject: subject)
        let presenter = DailyTestPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        // initialize
        view.viewModel.isLoading = true

        return view
    }
}

struct DailyTestView_Previews: PreviewProvider {
    static var previews: some View {
        DailyTestView(subject: SUBJECT.LANGUAGE)
    }
}
